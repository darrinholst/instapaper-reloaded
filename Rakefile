require 'barista/rake_task'

Barista::RakeTask.new do |t|
  t.input_directory = 'app'
  t.output_directory = 'javascripts'
  t.task_name = :compile
  t.rails = false
  t.bare = true
end

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'
