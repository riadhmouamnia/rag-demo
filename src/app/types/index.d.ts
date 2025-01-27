type FileType = {
  name: string;
  textContent: string;
};

type Docs = {
  Document: {
    pageContent: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: any;
    id?: string;
  }[];
};
