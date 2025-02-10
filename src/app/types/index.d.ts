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

interface WebUrlFormData {
  url: string;
}

interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof AddressFormData]?: string[];
  };
  input?: AddressFormData;
}
