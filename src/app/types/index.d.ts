interface FileType {
  name: string;
  textContent: string;
}

interface Docs {
  Document: {
    pageContent: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: any;
    id?: string;
  }[];
}

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

interface IntegrationFormData {
  openAiKey: string;
  dbConnectionString: string;
  tableName?: string;
}
