import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';

export function Builder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt } = location.state as { prompt: string };

  const webcontainer = useWebContainer();
  const [userPrompt, setPrompt] = useState('');
  const [llmMessages, setLlmMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  // Step handler
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;

    steps
      .filter(({ status }) => status === 'pending')
      .forEach(step => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split('/') ?? [];
          let currentFileStructure = [...originalFiles];
          let finalAnswerRef = currentFileStructure;
          let currentFolder = '';

          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              let file = currentFileStructure.find(x => x.path === currentFolder);
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: 'file',
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              let folder = currentFileStructure.find(x => x.path === currentFolder);
              if (!folder) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: 'folder',
                  path: currentFolder,
                  children: [],
                });
              }
              currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps(steps => steps.map(step => ({ ...step, status: 'completed' })));
    }
  }, [steps, files]);

  // Webcontainer file mount
  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(file.children.map(child => [child.name, processFile(child, false)]))
              : {},
          };
        } else {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: { contents: file.content || '' },
            };
          } else {
            return {
              file: { contents: file.content || '' },
            };
          }
        }
        return mountStructure[file.name];
      };

      files.forEach(file => processFile(file, true));
      return mountStructure;
    };

    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  // Initial prompt fetch
  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, { prompt: prompt.trim() });
    setTemplateSet(true);
    const { prompts, uiPrompts } = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({ ...x, status: 'pending' })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({ role: 'user', content })),
    });
    setLoading(false);

    setSteps(prev => [
      ...prev,
      ...parseXml(stepsResponse.data.response).map(x => ({ ...x, status: 'pending' as const })),
    ]);

    setLlmMessages([...prompts, prompt].map(content => ({ role: 'user', content })));
    setLlmMessages(prev => [...prev, { role: 'assistant', content: stepsResponse.data.response }]);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">Website Builder</h1>
          <p className="text-sm text-gray-400 mt-1 truncate max-w-[300px]">Prompt: {prompt}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
        >
          <span className="text-lg">&lt;/&gt;</span> Go to Home
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 grid grid-cols-4 gap-4 p-4 overflow-hidden">
        {/* Left Sidebar */}
<div className="col-span-1 flex flex-col max-h-[calc(100vh-8rem)] space-y-4 overflow-hidden">
  {/* Build Steps List */}
  <div className="flex-1 min-h-0 bg-gray-900 rounded-xl p-4 border border-gray-800 overflow-y-auto">
    <StepsList steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
  </div>

  {/* Prompt Box */}
  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
    {(loading || !templateSet) ? (
      <Loader />
    ) : (
      <>
        <textarea
          value={userPrompt}
          onChange={e => setPrompt(e.target.value)}
          className="w-full h-24 resize-none p-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
          placeholder="Refine your prompt or add new instructions..."
        />
        <button
          onClick={async () => {
            const newMessage = { role: 'user' as const, content: userPrompt };
            setLoading(true);

            const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
              messages: [...llmMessages, newMessage],
            });

            setLoading(false);
            setLlmMessages(x => [...x, newMessage, { role: 'assistant', content: stepsResponse.data.response }]);
            setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({ ...x, status: 'pending' as const }))]);
          }}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 transition duration-200"
        >
          Send
        </button>
      </>
    )}
  </div>
</div>

        {/* File Explorer */}
        <div className="col-span-1 bg-gray-900 rounded-xl p-4 border border-gray-800 overflow-y-auto h-[calc(100vh-8rem)]">
          <FileExplorer files={files} onFileSelect={setSelectedFile} />
        </div>

        {/* Editor / Preview */}
        <div className="col-span-2 bg-gray-900 rounded-xl p-4 border border-gray-800 flex flex-col h-[calc(100vh-8rem)]">
          <TabView activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-hidden mt-2">
            {activeTab === 'code' ? (
              <CodeEditor file={selectedFile} />
            ) : (
              webcontainer && <PreviewFrame webContainer={webcontainer} files={files} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
