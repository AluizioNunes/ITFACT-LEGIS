from graphiti_core.llm_client.openai_client import OpenAIClient
from openai.types.chat import ChatCompletionMessageParam
from pydantic import BaseModel
import json

class CustomOpenAIClient(OpenAIClient):
    """
    Custom OpenAIClient to handle structured output via standard chat completion
    instead of unsupported /responses endpoint (which seems specific to Zep or failing with Google).
    """
    async def _create_structured_completion(
        self,
        model: str,
        messages: list[ChatCompletionMessageParam],
        temperature: float | None,
        max_tokens: int,
        response_model: type[BaseModel],
        reasoning: str | None = None,
        verbosity: str | None = None,
    ):
        # Append schema instructions to system prompt or last message
        schema = response_model.model_json_schema()
        schema_json = json.dumps(schema, indent=2)
        
        # Check if there is a system message
        system_msg_idx = -1
        for i, msg in enumerate(messages):
            if msg['role'] == 'system':
                system_msg_idx = i
                break
        
        instruction = f"\n\nPlease output strict JSON matching the following schema:\n{schema_json}"
        
        if system_msg_idx >= 0:
            # messages[system_msg_idx]['content'] is usually str, but type hint says ...
            # We cast to str to be safe and append
            current_content = messages[system_msg_idx]['content']
            if isinstance(current_content, str):
                messages[system_msg_idx]['content'] = current_content + instruction
        else:
             messages.insert(0, {"role": "system", "content": f"You are a helpful assistant.{instruction}"})
             
        # Use standard chat completion
        response = await self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        if not content:
            raise Exception("Empty response from LLM")
            
        # Create a mock object structure expected by base client _handle_structured_response
        class MockResponse:
            def __init__(self, text):
                self.output_text = text
        
        return MockResponse(content)
