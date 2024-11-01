# citethese

`citethese` is a CLI tool that generates formatted citations (references) based on various unique identifiers, including URL, DOI, ISBN, PMID, and PMCID. Just pass in your identifiers, and `citethese` will handle the rest!

## Installation

Install `citethese` globally via npm:

```bash
npm install -g citethese
```

Or use it directly with `npx` without global installation:

```bash
npx citethese [unique identifiers]
```

## Usage

To generate citations, provide a list of unique identifiers as arguments. `citethese` will attempt to identify the type of each identifier automatically.

### Examples

```bash
# Using globally installed package
citethese 10.1000/xyz123 978-3-16-148410-0

# Using npx without global installation
npx citethese https://example.com/article 10.1000/xyz123
```

### Specifying Identifier Types

If `citethese` misinterprets an identifier’s type or if you want to force a specific type, you can prefix it with the type and a colon, like so:

```bash
citethese "url: https://doi.org/10.xyz123" "isbn: 978-3-16-148410-0"
```

This will force `citethese` to treat the first identifier as a URL and the second as an ISBN. This works for all identifier types: **url**, **doi**, **isbn**, **pmid**, and **pmcid**.

## Supported Identifiers

-   **DOI**: e.g., `10.1000/xyz123`
-   **URL**: e.g., `https://example.com/article`
-   **ISBN**: e.g., `978-3-16-148410-0`
-   **PMID**: e.g., `12345678`
-   **PMCID**: e.g., `PMC1234567`

## Output

`citethese` generates a formatted citation (reference) for each identifier. The output is styled for easy copy-pasting into documents and includes all relevant citation details, formatted according to standard citation styles.

## License

This project is licensed under the MIT License.
