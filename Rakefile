require File.join(File.dirname(__FILE__), '/src/sprockets_config')

# require 'jasmine'
# load 'jasmine/tasks/jasmine.rake'

desc 'precompile the assets'
task :precompile do
  sprockets.precompile
end

task :default => :precompile

def sprockets
  @config ||= SprocketsConfig.new(YAML::load(File.open("sprockets.yml")))
end
