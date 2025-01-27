export default function combineDocuments(docs: Docs["Document"]) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}
