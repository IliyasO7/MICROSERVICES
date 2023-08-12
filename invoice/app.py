from flask import Flask, render_template, make_response
from pymongo import MongoClient
import pdfkit
from helpers import amount_to_words

app = Flask(__name__)

# Set up MongoDB connection
client = MongoClient("mongodb://admin:houseJoy123@52.66.37.164:27017")
db = client["dev"]
invoices_collection = db["invoices"]

# Route to fetch invoice data, render HTML template, and generate PDF
@app.route("/generate/<invoice_id>")
def generate_invoice_pdf(invoice_id):
    # Fetch invoice data from MongoDB
    invoice = invoices_collection.find_one({"_id": invoice_id})
    if not invoice:
        return "Invoice not found", 404
    
    # Render the HTML template with invoice data
    rendered_html = render_template("invoice_template.html", invoice=invoice, items=enumerate(invoice['items'], 1), amountInWords=amount_to_words(invoice['totalAmount']))

    # Generate PDF from the rendered HTML
    pdf_stream = pdfkit.from_string(rendered_html, False)

    # Create a response with PDF content
    response = make_response(pdf_stream)
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = f"inline; filename=invoice_{invoice_id}.pdf"

    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5005, debug=True)




