from reportlab.pdfgen import canvas

c = canvas.Canvas("test_upload.pdf")
c.drawString(100, 750, "Este é um documento de teste para o Graphiti e Neo4j.")
c.drawString(100, 730, "Ele deve ser indexado corretamente no grafo de conhecimento.")
c.save()
print("PDF criado com sucesso.")
