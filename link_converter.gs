/**
 * Detects hyperlinks in the document and replaces the text with its HTML <a> representation.
 * Example: "Google" (linked to google.com) becomes "<a href="https://google.com">Google</a>"
 */
function convertLinksToHTMLTags() {
  const body = DocumentApp.getActiveDocument().getBody();
  const paragraphs = body.getParagraphs();
  
  // Loop through every paragraph
  paragraphs.forEach(paragraph => {
    const textElement = paragraph.editAsText();
    const textString = textElement.getText();
    
    // Work backwards through the text to maintain correct offsets 
    // as we insert longer HTML strings.
    for (let i = textString.length - 1; i >= 0; i--) {
      const url = textElement.getLinkUrl(i);
      
      if (url) {
        // Find the full range of this specific link
        let end = i;
        let start = i;
        while (start > 0 && textElement.getLinkUrl(start - 1) === url) {
          start--;
        }
        
        const originalText = textString.substring(start, end + 1);
        const htmlTag = `<a href="${url}">${originalText}</a>`;
        
        // Perform the replacement
        textElement.deleteText(start, end);
        textElement.insertText(start, htmlTag);
        
        // Remove the blue link formatting from the new HTML string
        textElement.setLinkUrl(start, start + htmlTag.length - 1, null);
        textElement.setUnderline(start, start + htmlTag.length - 1, false);
        textElement.setForegroundColor(start, start + htmlTag.length - 1, null);
        
        // Jump 'i' to the start of the processed link
        i = start;
      }
    }
  });
}
