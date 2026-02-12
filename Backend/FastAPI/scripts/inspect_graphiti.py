from graphiti_core import Graphiti
import inspect

print("Constructor Signature:")
print(inspect.signature(Graphiti.__init__))

print("\nMethod add_episode Signature:")
print(inspect.signature(Graphiti.add_episode))
