class CustomDeviseControllers::RegistrationsController < Devise::RegistrationsController
  def verify_email
    flash[:notice] = ""
  end

  def update_email
    @user = User.find(current_user.id)
    params[:user].delete(:current_password)
    if @user.update_without_password(devise_parameter_sanitizer.sanitize(:account_update))
      flash[:notice] = "Welcome! You have signed up successfully."
      sign_in @user, :bypass => true
      redirect_to bookshelf_index_url
    else
      @error_message = "You have entered an invalid email address"
      render "verify_email"
    end
  end

  protected
    def after_sign_in_path_for(resource)
      verify_user_email_path
    end
end
