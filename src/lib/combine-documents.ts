export default function combineDocuments(docs: Docs["Document"]) {
  console.log("Relevant docs:", docs);
  return docs.map((doc) => doc.pageContent).join("\n\n");
}
