import urllib.parse
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
# --- NEW IMPORTS ---
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
# ---

app = Flask(__name__)
CORS(app)

# --- Database Config ---
password = urllib.parse.quote_plus("Sumit@12373*")
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://postgres:{password}@localhost/simple_login_logout"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# --- NEW: Configure JWT ---
# You must provide a secret key. Make this a long, random string!
# You can generate one in a python shell with: import secrets; secrets.token_hex(32)
app.config["JWT_SECRET_KEY"] = "my-super-secret-random-key-here"  # CHANGE THIS!
jwt = JWTManager(app)
# ---

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# --- Database Model (no changes needed) ---
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

# --- API Routes ---

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 409
    try:
        new_user = User(email=data['email'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        # --- MODIFIED: Create and return a token! ---
        # The 'identity' is who this token belongs to. We'll use the user's ID.
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200 # Return the token
        # ---
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

# --- NEW: A Test Route ---
# Let's create a protected route to test our token
@app.route('/profile', methods=['GET'])
@jwt_required()  # This decorator protects the route
def profile():
    # We can get the user's ID from the token like this
    # (We'll use this more later)
    # current_user_id = get_jwt_identity()
    return jsonify(message="Welcome! This is a protected route."), 200

# --- Run the App (no changes needed) ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)