import { parseDocument } from "htmlparser2";
import { DomUtils } from "htmlparser2";
import { render as domSerializer } from "dom-serializer";

export function chunkHtmlSafely(html, targetLength = 2000) {
    const doc = parseDocument(html);
    const body = DomUtils.findOne(elem => elem.name === "body", doc.children, true);

    if (!body) {
        // No <body>, fallback to root children
        return chunkNodesDFS(doc.children, targetLength);
    }

    return chunkNodesDFS(body.children, targetLength);
}

/**
 * Recursively chunk nodes with DFS
 * Returns an array of HTML string chunks
 */
function chunkNodesDFS(nodes, targetLength) {
    const chunks = [];
    let currentChunk = [];
    let currentLength = 0;

    for (const node of nodes) {
        const nodeHtml = DomUtils.getOuterHTML(node);

        if (nodeHtml.length > targetLength && node.children && node.children.length > 0) {
            // If node is too large and has children, chunk children recursively
            const childChunks = chunkNodesDFS(node.children, targetLength);

            // Flush current chunk before pushing child chunks
            if (currentChunk.length > 0) {
                chunks.push(domSerializer({ type: "root", children: [...currentChunk] }));
                currentChunk = [];
                currentLength = 0;
            }

            // Add all child chunks separately
            chunks.push(...childChunks);
        } else {
            // Add node to current chunk
            currentChunk.push(node);
            currentLength += nodeHtml.length;

            if (currentLength >= targetLength) {
                chunks.push(domSerializer({ type: "root", children: [...currentChunk] }));
                currentChunk = [];
                currentLength = 0;
            }
        }
    }

    // Add any leftover nodes as last chunk
    if (currentChunk.length > 0) {
        chunks.push(domSerializer({ type: "root", children: [...currentChunk] }));
    }

    return chunks;
}
