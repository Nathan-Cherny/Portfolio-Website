from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('main.html')

@app.route('/ecosystem')
def ecosystem():
    return render_template('ecosystem.html')

@app.route('/sudoku')
def sudoku():
    return render_template('sudoku.html')

@app.route('/nandCalculator')
def nandCalculator():
    return render_template('nandCalculator.html')

@app.errorhandler(404)
def not_found(e):
    return render_template("404.html")

app.run()