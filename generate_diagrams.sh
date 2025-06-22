#!/bin/bash

echo "Generating MDA Workflow Diagrams..."
echo

# Check if Graphviz is installed
if ! command -v dot &> /dev/null; then
    echo "Error: Graphviz is not installed or not in PATH"
    echo "Please install Graphviz from: https://graphviz.org/download/"
    echo
    echo "For Ubuntu/Debian: sudo apt-get install graphviz"
    echo "For macOS with Homebrew: brew install graphviz"
    echo "For CentOS/RHEL: sudo yum install graphviz"
    exit 1
fi

echo "Graphviz found. Generating diagrams..."
echo

# Create output directory
mkdir -p diagrams

# Generate PNG diagrams
echo "Generating PNG diagrams..."
dot -Tpng workflow_diagram.dot -o diagrams/workflow_diagram.png
dot -Tpng user_workflow.dot -o diagrams/user_workflow.png
dot -Tpng technical_architecture.dot -o diagrams/technical_architecture.png
dot -Tpng business_workflow.dot -o diagrams/business_workflow.png

# Generate SVG diagrams
echo "Generating SVG diagrams..."
dot -Tsvg workflow_diagram.dot -o diagrams/workflow_diagram.svg
dot -Tsvg user_workflow.dot -o diagrams/user_workflow.svg
dot -Tsvg technical_architecture.dot -o diagrams/technical_architecture.svg
dot -Tsvg business_workflow.dot -o diagrams/business_workflow.svg

# Generate PDF diagrams
echo "Generating PDF diagrams..."
dot -Tpdf workflow_diagram.dot -o diagrams/workflow_diagram.pdf
dot -Tpdf user_workflow.dot -o diagrams/user_workflow.pdf
dot -Tpdf technical_architecture.dot -o diagrams/technical_architecture.pdf
dot -Tpdf business_workflow.dot -o diagrams/business_workflow.pdf

echo
echo "All diagrams generated successfully in 'diagrams' folder:"
echo
echo "PNG files (for web/email):"
echo "- workflow_diagram.png"
echo "- user_workflow.png"
echo "- technical_architecture.png"
echo "- business_workflow.png"
echo
echo "SVG files (for web, scalable):"
echo "- workflow_diagram.svg"
echo "- user_workflow.svg"
echo "- technical_architecture.svg"
echo "- business_workflow.svg"
echo
echo "PDF files (for printing):"
echo "- workflow_diagram.pdf"
echo "- user_workflow.pdf"
echo "- technical_architecture.pdf"
echo "- business_workflow.pdf"
echo
echo "You can also view the diagrams online at:"
echo "https://dreampuf.github.io/GraphvizOnline/"
echo 