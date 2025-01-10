from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__)

# Path to the gallery folder
GALLERY_FOLDER = '/Users/db300/Documents/Coding_Shit/DPD\'s_Log/Gallery/'

# Path to the Obsidian vault
OBSIDIAN_VAULT_PATH = '/path/to/your/obsidian/vault'  # Update this to your actual Obsidian vault path

@app.route('/')
def index():
    return render_template('gallery.html')

@app.route('/api/images')
def get_images():
    images = [f for f in os.listdir(GALLERY_FOLDER) if f.endswith(('jpg', 'jpeg', 'png', 'gif'))]
    return jsonify(images)

@app.route('/logs', methods=['GET'])
def get_logs():
    logs = []
    # Read from your Obsidian Markdown files and parse them into logs
    for filename in os.listdir(OBSIDIAN_VAULT_PATH):
        if filename.endswith('.md'):
            with open(os.path.join(OBSIDIAN_VAULT_PATH, filename), 'r') as file:
                content = file.read()
                # Parse content into log format
                logs.append(parse_log(content))
    return jsonify(logs)

@app.route('/logs', methods=['POST'])
def add_log():
    log_data = request.json
    # Format log data as Markdown
    markdown_content = format_log_as_markdown(log_data)
    # Write to a new Markdown file
    with open(os.path.join(OBSIDIAN_VAULT_PATH, f"{log_data['title']}.md"), 'w') as file:
        file.write(markdown_content)
    return jsonify({"message": "Log added successfully!"}), 201

def parse_log(content):
    # Implement your logic to parse the Markdown content into log format
    return {"title": "Parsed Title", "content": content}  # Example structure

def format_log_as_markdown(log_data):
    # Format the log data into Markdown
    return f"# {log_data['title']}\n\n{log_data['content']}"

if __name__ == '__main__':
    app.run(debug=True)
