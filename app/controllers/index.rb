get '/' do
  erb :"index"
end

post '/' do

end


post '/recipes' do

	if request.xhr?
		puts params
		
		@recipe = params[:data]
		erb :"recipe"
	end

end


