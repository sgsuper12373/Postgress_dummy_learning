import psycopg2
from config import host_name, database_name, user_name, password_name
# This new import will help us access columns by name
import psycopg2.extras
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)



# Function to connect to the database
def get_db_connection():
    conn = psycopg2.connect(
        host=host_name, 
        database=database_name, 
        user=user_name, 
        password=password_name, 
    )
    return conn

# Change this route to fetch and display books
@app.route('/')
def index():
    conn = get_db_connection()
    # DictCursor lets us access columns by name (like book['title'])
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute('SELECT * FROM books ORDER BY id;')
    books = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('index.html', books=books)

@app.route('/add', methods=['POST']) 
def add_book(): 
    title = request.form['title']
    author = request.form['author']

    conn = get_db_connection(); 
    cur = conn.cursor()
    cur.execute('insert into books (title, author) values (%s, %s) ' , (title, author))
    conn.commit();
    cur.close()
    conn.close()

    return redirect(url_for('index'))

# The previous code for add_book() stays the same...

# THIS IS THE NEW ROUTE for deleting books
@app.route('/delete/<int:id>', methods=['POST'])
def delete_book(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('DELETE FROM books WHERE id = %s', (id,))
    conn.commit()
    cur.close()
    conn.close()
    return redirect(url_for('index'))


