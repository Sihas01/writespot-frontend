import { IoIosArrowDown } from "react-icons/io";
import NavigationButtons from "./NavigationButtons";
import SelectField from "./SelectField";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import FileUpload from "./FileUpload";

function BookDetailsStep({ formData, onChange, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' }
  ];

  const genreOptions = [
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Science Fiction' },
    { value: 'biography', label: 'Biography' },
    { value: 'self-help', label: 'Self-Help' }
  ];

  return (
    <form onSubmit={handleSubmit} className="font-nunito font-normal">
      <h2 className="text-2xl font-nunito font-semibold text-gray-800 mb-8">Book Details</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <h2 className="col-span-1">Language</h2>
          <div className="col-span-2 pt-4 md:pt-0">
            <h2>Select your eBook language (the language in which the book was written) </h2>
            <SelectField
              label="Language"
              name="language"
              value={formData.language}
              onChange={onChange}
              options={languageOptions}
              placeholder="Select Language"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          <h2 className="col-span-1">Book Title</h2>
          <div className="col-span-2 pt-4 md:pt-0">
            <h2>Enter your title same as in the book cover.  </h2>
            <InputField
              label="Book Title"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="Enter book title"
              required

            />

            <InputField
              label="Subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={onChange}
              placeholder="Enter subtitle (optional)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          <h2 className="col-span-1">Book Description</h2>
          <div className="col-span-2 pt-4 md:pt-0">
            <h2>Enter Description for your book  </h2>
            <TextareaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Enter book description"
              required
              rows={5}
            />

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          <h2 className="col-span-1">Author</h2>
          <div className="col-span-2 pt-4 md:pt-0">
            <h2>Enter Primary Author Name</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 ">
              <InputField
                label="Author First Name"
                name="authorFirstName"
                value={formData.authorFirstName}
                onChange={onChange}
                placeholder="Enter author first name"
                required
              />
              <InputField
                label="Author Last Name"
                name="authorLastName"
                value={formData.authorLastName}
                onChange={onChange}
                placeholder="Enter author last name"
                required
              />
            </div>
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-3">
          <h2 className="col-span-1">Categories</h2>
          <div className="col-span-2 pt-4 md:pt-0">
            <h2>Choose Category for your book</h2>

            <SelectField
              label="Genre/Category"
              name="genre"
              value={formData.genre}
              onChange={onChange}
              options={genreOptions}
              placeholder="Select Genre"
              required
            />
          </div>
        </div>


<div className="grid grid-cols-1 md:grid-cols-3">
          <h2 className="col-span-1">Keywords</h2>
          <div className="col-span-2 pt-4 md:pt-0">
            <h2>Enter up to 5 search key words that describe your book (Optional)</h2>
        <InputField
          label="Keywords"
          name="keywords"
          value={formData.keywords}
          onChange={onChange}
          placeholder="Enter keywords separated by commas"
        />
          </div>
        </div>

       
      </div>

      <NavigationButtons onNext={onNext} showBack={false} />
    </form>
  );
}


export default BookDetailsStep;