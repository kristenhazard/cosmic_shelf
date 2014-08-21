class BookshelfController < ApplicationController
  def index
  end

  def get_books
    books = (current_user == nil) ? nil : current_user.books
    respond_to do |format|
      format.js { render :json => books }
    end
  end
end
