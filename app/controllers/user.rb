
get '/users/new' do
  erb :'/users/new'
end

post '/users' do
  @user = User.create(username: params[:username], password: params[:password])
  if @user.valid?
    session[:user_id] = @user.id
    redirect '/'
  else
    @errors = @user.errors.full_messages
    erb :'/users/show'
  end
end

get '/users/:id' do
  if current_user
    @user = User.find(session[:user_id])
    @user_restaurants = @user.restaurants
    @user_reviews = @user.reviews
    erb :'/users/show'
  else
    redirect '/'
  end
end

get '/users/:id/edit' do
    @user = User.find(session[:user_id])
   erb :'/users/edit_profile'
  end

put '/users/:id' do
  @user = User.find(session[:user_id])
  @user.update_attributes(username: params[:name], password: params[:password])
  @user.save
  redirect "/users/#{@user.id}"
end

delete '/users/:id' do
  @user = User.find(session[:user_id])
  @user.destroy
  redirect "/"
end
