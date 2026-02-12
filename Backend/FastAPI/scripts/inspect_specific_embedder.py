try:
    from graphiti_core.embedder.openai import OpenAIEmbedder
    print("Found OpenAIEmbedder")
    import inspect
    print(inspect.signature(OpenAIEmbedder.__init__))
except ImportError as e:
    print(f"Could not import OpenAIEmbedder: {e}")

try:
    from graphiti_core.embedder.sentence_transformers import SentenceTransformerEmbedder
    print("Found SentenceTransformerEmbedder")
except ImportError:
    print("No SentenceTransformerEmbedder found")
