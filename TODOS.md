# Temporary Patches
- Issues with '.tsx' files in `node_modules` coming from `@duckdb/duckdb-wasm` or `@duckdb/ducdkdb-react`.
- Split out tsconfig to better support `yarn start` not checking `test/` files

# Future Improvements
- Clean up styling to use a consistent approach instead of a combination of inline styles and css modules
- Add barrel files to simplify import references
- Do a deeper dive into Arrow data format to figure out the best way to parse the DuckDB query responses
- Look into `CREATE TABLE` from local file:
```
const pickedFile: File = letUserPickFile();
await db.registerFileHandle("local.parquet", pickedFile);
```
- `<Tabs />` from Chakra UI was temporarily abandoned and replaced with simple Button/state/conditional component render because the `Tab` related components introduced a really deep DOM structure that made it hard to keep the ScatterPlot auto resize functionality
- Improve accessibility around core components

## pages/Shell
- Improve UX by refactoring loading/error content to prevent it from repositioning other components

## components/QueryEditor
- Look into `monaco-editor` or something that will have nicer highlighting
- Look into autocomplete functionality

## visualizations/ScatterPlot
- Clean up references to mock data