import { buildAggragationPipeline } from "./pipeline.js";

test("uses the correct vector index and path", () => {
    const pipeline = buildAggragationPipeline([0.1, 0.2]);
    const stage = pipeline[0].$vectorSearch;

    expect(stage.index).toBe("vector_index_test");
    expect(stage.path).toBe("embedding");
});

test("passes the query embedding through", () => {
    const vector = [0.1, 0.2, 0.3];
    const pipeline = buildAggragationPipeline(vector);

    expect(pipeline[0].$vectorSearch.queryVector).toEqual(vector);
});

test("returns up to 10 results", () => {
    const pipeline = buildAggragationPipeline([0.1]);

    expect(pipeline[0].$vectorSearch.limit).toBe(10);
});