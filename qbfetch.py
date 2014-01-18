import webapp2;
import cgi;
import re;
import os;
import jinja2;
import json
import urllib
from google.appengine.api import urlfetch

#orig stuff is Environment('{%', '%}', '{{', '}}', '{#', '#]')
#jinja_environment = jinja2.Environment('<%', '%>', '<%=', '%>', '<%#', '%>',autoescape=True,
jinja_environment = jinja2.Environment(autoescape=True,
	#loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '')));
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')));
class fetchUI(webapp2.RequestHandler):
	def get(self):
		template = jinja_environment.get_template('base.html');
		self.response.out.write(template.render({'name':'Ashwin'}));
		#self.response.out.write(template.render({'name':jinja_environment.get_template('quiz.html')}));
class quizPage(webapp2.RequestHandler):
	def get(self):
		template = jinja_environment.get_template('quiz.html');
		self.response.out.write(template.render({'name':'Ashwin'}));
		


class fetchProxy(webapp2.RequestHandler):
	def fillTemplate (self,template_values={'name':'Ashwin'}):
		template = jinja_environment.get_template('socketPage.html');
		self.response.out.write(template.render(template_values));
	def get(self):
		"""global users
		#game_key=self.request.get("key");
		userId=self.request.get("userId");
		if not userId: userId="guest"+str(len(users));
		game_key=str(int((round(time_.time() * 1000))))+"."+str(randint(1, 1000));
		token = channel.create_channel(userId+str(game_key))
		users.append([userId,game_key]);
		template_values = {
							'me':userId,
							'game_key':game_key,
							'token': token
		                   }
		self.fillTemplate(template_values);"""
		"""#self.fillTemplate({'name':'Ashwin'});
		#second arg is default value
		url = 'http://www.quinterest.org/php/search.php?'+'info='+urllib.quote_plus(self.request.get('info','Fermi'))+'&stype='+self.request.get('stype','Answer')+'&categ=All&difficulty=HS&tournamentyear=All';
		#try:
		result = urlfetch.fetch(url)
		#result.status_code https://developers.google.com/appengine/docs/python/urlfetch/responseobjects
		self.response.out.write(result.content)
		#except urllib2.URLError, e:
		#  self.response.out.write(e)"""
		for t in urllib.quote_plus(self.request.get('info','Fermi')).split("%3B"):
			url = 'http://www.quinterest.org/php/search.php?'+'info='+t+'&stype='+self.request.get('stype','Answer')+'&categ=All&difficulty=HS&tournamentyear=All';
			result = urlfetch.fetch(url)
			self.response.out.write(result.content)
		#'\n'.join(fullstring.split('\n')[1:])


















