#!/usr/bin/env node

import CSLJson from "./CSLJson.js";

const args = process.argv.slice(2);
const style = "apa";
const locale = "en-US";

async function retrieveContent(identifiers) {
    const contentArray = await Promise.all(
        identifiers.map(async (identifier) => {
            const [identifierType, cleanedIdentifier] = identifier;
            const cslJson = new CSLJson();

            switch (identifierType) {
                case "URL":
                    return await cslJson.fromURL(cleanedIdentifier);
                case "DOI":
                    return await cslJson.fromDOI(cleanedIdentifier);
                case "PMCID":
                    return await cslJson.fromPMCID(cleanedIdentifier);
                case "PMID":
                    return await cslJson.fromPMID(cleanedIdentifier);
                case "ISBN":
                    return await cslJson.fromISBN(cleanedIdentifier);
                default:
                    return null;
            }
        })
    );

    return contentArray;
}

function recognizeIdentifierType(string) {
    const trimmedString = string.trim();

    if (trimmedString.startsWith("url:")) return ["URL", trimmedString.slice(4).trim()];
    if (trimmedString.startsWith("doi:")) return ["DOI", trimmedString.slice(4).trim()];
    if (trimmedString.startsWith("pmcid:")) return ["PMCID", trimmedString.slice(6).trim()];
    if (trimmedString.startsWith("pmid:")) return ["PMID", trimmedString.slice(5).trim()];
    if (trimmedString.startsWith("isbn:")) return ["ISBN", trimmedString.slice(5).trim()];

    const patterns = {
        DOI: /^((https?:\/\/)?(?:dx\.)?doi\.org\/)?10\.\d{4,9}\/[-._;()/:a-zA-Z0-9]+$/,
        URL: /^(https?:\/\/)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/,
        PMCID: /^PMC\d+$/,
        PMID: /^\d{7,10}$/,
        ISBN: /^(97[89])\d{9}(\d|X)$/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(trimmedString)) return [type, trimmedString];
    }

    return ["undefined", trimmedString];
}

(async () => {
    // Parse and classify identifiers
    const identifiers = args.map(recognizeIdentifierType);
    const definedIdentifiers = identifiers.filter(([type]) => type !== "undefined");
    const undefinedIdentifiers = identifiers.filter(([type]) => type === "undefined");

    // Display undefined identifiers
    if (undefinedIdentifiers.length) {
        console.log(
            `Unable to determine the type of these identifiers:\n${undefinedIdentifiers
                .map(([_, id]) => `[Undefined] ${id}\n`)
                .join("")}`
        );
    }

    // Process defined identifiers
    if (definedIdentifiers.length) {
        console.log(
            `Retrieving data for these identifiers:\n${definedIdentifiers
                .map(([type, id]) => `[${type}] ${id}\n`)
                .join("")}`
        );

        const contentArray = await retrieveContent(definedIdentifiers);
        const failedRetrievals = contentArray.filter((content) => content?.status === "failed");
        const successfulRetrievals = contentArray.filter((content) => content?.status !== "failed");

        // Display failed retrievals
        if (failedRetrievals.length) {
            console.log(
                `Failed to retrieve content from these identifiers:\n${failedRetrievals
                    .map(({ type, identifier }) => `[${type}] ${identifier}\n`)
                    .join("")}`
            );
        }

        // Generate and display references
        if (successfulRetrievals.length) {
            const csl = new CSLJson(successfulRetrievals);
            const references = await csl.toBibliography({ style, locale });
            console.log(`References:\n${references}`);
        }
    }
})();
