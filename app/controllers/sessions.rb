get '/sessions/new' do
  erb :'sessions/new'
end

post '/sessions' do

  @user = User.find_by(username: params[:username])
  if @user.authenticate(params[:password])
     session[:user_id] = @user.id
     redirect :'/restaurants'
  else

    redirect '/'
  end
end

get '/sessions/log_out' do
  session[:user_id] = nil
  redirect '/'
end
