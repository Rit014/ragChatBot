export function buildAggragationPipeline(queryEmbedding) {
    return [
        {
            $vectorSearch: {
                queryVector: queryEmbedding,
                path: "embedding",
                numCandidates: 100,
                limit: 10,
                index: "vector_index_test",
            },
        },
        {
            $project: {
                text: 1,
                score: { $meta: "vectorSearchScore" },
            },
        },
    ]
}