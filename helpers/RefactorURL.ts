export default function RefactorURL(url: string) {
  if (url.includes("reddit")) {
    return "Reddit";
  }
  return "Database";
}
