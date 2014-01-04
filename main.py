#API: http://developer.github.com/v3/repos/contents/#create-a-file
import webapp2;
import cgi;
import re;
import os;
import jinja2;
jinja_environment = jinja2.Environment('<%', '%>', '<%=', '%>', '<%#', '%>',autoescape=True,
	loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')));
from qbfetch import *;

"""class fetchUI(webapp2.RequestHandler):
	def post(self):
		q=self.request.get("q");
		self.response.out.write(q);
		#self.response.headers['Content-Type'] = 'text/plain';
		#self.response.out.write(self.request);"""

app = webapp2.WSGIApplication([('/', fetchUI),
								('/fetchEngine',fetchProxy)
							  ],
                              debug=True);

# How to use the Jinja2 (plus import os, jinja2, etc.):
"""
template_values = {'name': 'Ashwin'};
template = jinja_environment.get_template('mainpage.html');
self.response.out.write(template.render(template_values));
"""
#As a function: (Call with dictionary as parameter:)
#Call ex: self.fillTemplate({"name":"Nguyen"});
"""
def fillTemplate (self,template_values={'name':'Ashwin'}):
	template = jinja_environment.get_template('mainpage.html');
	self.response.out.write(template.render(template_values));
"""
#Another function: (Call with values themselves instead of dictionary):
#Call ex: self.fillTemplate("Nguyen");
"""
def fillTemplate (self, username=""):
	template_values={
	'username':username
	};
	template = jinja_environment.get_template('signupwelcome.html');
	self.response.out.write(template.render(template_values));
"""