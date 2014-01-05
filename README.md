#QBFetch

##Introduction
An application which lets you study individual clues for quizbowl tossups much more easily. It runs on Google App Engine using Python, and it's currently hosted at http://qbfetch.appspot.com.

##How it works
You search for a term, and it gets all the tossups from [Quinterest](http://www.quinterest.org), an extensive quizbowl database. It then splits each tossup into clues, which are essentially separated by periods. You can then edit separate clues, combine them, or even sort them using a "smart" (but slow) sort algorithm which puts similar clues together so you can get rid of or combine them.
You have control over the whole process, and then you can save the clues to the Datastore.

##Future
Future integration with [my quizbowl quizzer](http://epicfaace.github.io/quizbowl/quiz.html), which is different in that you can actually learn: It asks you a random clue, and once you answer, it displays the other clues associated with that tossup so you can make connections and learn about the subject.
I'm hoping that I can use the quizzer to pull questions from the datastore. So, you would have a list of topics (sorted by subject), and you can label them (similar to Gmail labels) into different groups. You could have a "Famous Scientists" group, or a "Study List 1" group. Like Gmail labels, though, one subject can belong to different groups.
Then, you could select a group/label to study, and it will ask you questions only pertaining to that group. Eventually, you can master it!
