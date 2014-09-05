class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def after_sign_in_path_for(resource)
    if resource.provider == "twitter" && resource.sign_in_count == 1
      verify_user_email_path
    else
      bookshelf_index_url
    end
  end
end
