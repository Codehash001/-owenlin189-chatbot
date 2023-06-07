import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { pinecone } from '@/utils/pinecone-client';
import { CustomPDFLoader , CustomCSVLoader, CustomTextLoader, CustomMarkdownLoader } from '@/utils/customPDFLoader';
import { PINECONE_INDEX_NAME} from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders';
import fs from 'fs/promises';

/* Name of directory to retrieve your files from */
const filePath = 'public/temp';

export const run = async (pineconeSpaceX: string) => {
  const pineconeSpace = pineconeSpaceX
  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new CustomPDFLoader(path),
      '.csv': (path) => new CustomCSVLoader(path),
      '.txt':(path) => new CustomTextLoader(path),
      '.md':(path) => new CustomMarkdownLoader(path),
    });

    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: pineconeSpace,
      textKey: 'text',
    });
    console.log('All files deleted');
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

const pineconeSpaceX = process.argv[2]; // Retrieve the argument from command line

(async () => {
  await run(pineconeSpaceX);
  console.log('ingestion complete');
})();
