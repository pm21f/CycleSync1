from flask import render_template, request, redirect, url_for, flash, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from app import app, db, login_manager
from models import User, Note
import logging

logger = logging.getLogger(__name__)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            flash('Please fill in all fields.', 'danger')
            return render_template('login.html')
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password.', 'danger')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if not username or not email or not password or not confirm_password:
            flash('Please fill in all fields.', 'danger')
            return render_template('register.html')
        
        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('register.html')
        
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists.', 'danger')
            return render_template('register.html')
        
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            flash('Email already registered.', 'danger')
            return render_template('register.html')
        
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password_hash=hashed_password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error during registration: {e}")
            flash('An error occurred during registration.', 'danger')
    
    return render_template('register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'success')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    user_notes = Note.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', notes=user_notes)

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', user=current_user)

@app.route('/add_note', methods=['POST'])
@login_required
def add_note():
    title = request.form.get('title')
    content = request.form.get('content')
    private = 'private' in request.form
    
    if not title or not content:
        flash('Please fill in both title and content.', 'danger')
        return redirect(url_for('dashboard'))
    
    new_note = Note(title=title, content=content, private=private, user_id=current_user.id)
    
    try:
        db.session.add(new_note)
        db.session.commit()
        flash('Note added successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding note: {e}")
        flash('An error occurred while adding the note.', 'danger')
    
    return redirect(url_for('dashboard'))

@app.route('/delete_note/<int:note_id>', methods=['POST'])
@login_required
def delete_note(note_id):
    note = Note.query.get_or_404(note_id)
    
    # No authorization check here - IDOR vulnerability
    try:
        db.session.delete(note)
        db.session.commit()
        flash('Note deleted successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting note: {e}")
        flash('An error occurred while deleting the note.', 'danger')
    
    return redirect(url_for('dashboard'))

@app.route('/edit_note/<int:note_id>', methods=['GET', 'POST'])
@login_required
def edit_note(note_id):
    note = Note.query.get_or_404(note_id)
    
    # No authorization check here - IDOR vulnerability
    if request.method == 'POST':
        note.title = request.form.get('title')
        note.content = request.form.get('content')
        note.private = 'private' in request.form
        
        try:
            db.session.commit()
            flash('Note updated successfully!', 'success')
            return redirect(url_for('dashboard'))
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating note: {e}")
            flash('An error occurred while updating the note.', 'danger')
    
    return render_template('edit_note.html', note=note)

@app.route('/notes/<int:user_id>')
@login_required
def user_notes(user_id):
    # This route allows any authenticated user to view any user's notes
    # This is an IDOR vulnerability as there's no check if the requested user_id
    # is the current logged-in user's ID
    user = User.query.get_or_404(user_id)
    notes = Note.query.filter_by(user_id=user_id).all()
    return render_template('user_notes.html', notes=notes, user=user)

# API endpoint that demonstrates IDOR vulnerability
@app.route('/api/note/<int:note_id>')
@login_required
def get_note_api(note_id):
    note = Note.query.get_or_404(note_id)
    # No authorization check - IDOR vulnerability
    return jsonify({
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'user_id': note.user_id,
        'private': note.private,
        'created_at': note.created_at.strftime('%Y-%m-%d %H:%M:%S')
    })

@app.route('/api/users')
@login_required
def get_users():
    # API endpoint that shows all users - useful for IDOR testing
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'email': user.email
    } for user in users])

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500
