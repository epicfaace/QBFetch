import webapp2;
import cgi;
import jinja2;
import os
import re
import json
import datetime
from google.appengine.ext import db

jinja_environment = jinja2.Environment('<%', '%>', '<%=', '%>', '<%#', '%>',autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')));
class Term(db.Model):
	term = db.StringProperty(required=True)
	clues = db.StringListProperty(required=True)
	category = db.StringProperty()
	labels = db.StringListProperty()

class saveQ(webapp2.RequestHandler):
	def post(self):
		employee = Term(term=self.request.get("term").lower(),
						clues=json.loads(self.request.get("clues")),
		                category=self.request.get("category").lower())

		#employee.hire_date = datetime.datetime.now().date()
		employee.put()

		self.response.out.write("Save successful");

		#self.request.get("q")
		#template = jinja_environment.get_template('fetch.html');
		#self.response.out.write(template.render({'name':'Ashwin'}));
class getQ(webapp2.RequestHandler):
	def get(self):
		q = Term.all()
		if (self.request.get("all")):
			pass
		elif (self.request.get("gql")):
			q=Term.gql(self.request.get("term"));
		else:
			q.filter("term =",self.request.get("term").lower())
		#q.filter("last_name =", "Smith")
		#q.filter("height <=", max_height)
		#q.order("-height")

		#result = q.get()
		#q.run() gets an object with all the results
		self.response.out.write(json.dumps(map(lambda x:x._entity,q.run()),default=lambda o: o.__dict__))