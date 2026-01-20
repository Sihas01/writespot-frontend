import FileUpload from "./FileUpload";
import NavigationButtons from "./NavigationButtons";
import SelectField from "./SelectField";

function ContentStep({ formData, onChange, onBack, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.manuscript) {
      const uploadedFileType = formData.manuscript.name.split('.').pop().toLowerCase();
      if (uploadedFileType !== 'docx') {
        alert(`Only .docx files are allowed. You uploaded a .${uploadedFileType} file.`);
        return;
      }
    } else {
      alert('Please upload a manuscript file.');
      return;
    }
    onNext();
  };

  const formatOptions = [
    { value: 'docx', label: 'DOCX' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-nunito font-semibold text-gray-800 mb-8">eBook Content</h2>



      <div className="space-y-6">
        <FileUpload
          label="Cover Image"
          name="coverImage"
          onChange={onChange}
          accept="image/*"

          file={formData.coverImage}
        />

        <FileUpload
          label="Manuscript File"
          name="manuscript"
          onChange={onChange}
          accept=".docx"

          file={formData.manuscript}
        />

        <SelectField
          label="File Format"
          name="fileFormat"
          value={formData.fileFormat}
          onChange={onChange}
          options={formatOptions}
          placeholder="Select Format"
          required
        />


      </div>

      <NavigationButtons onBack={onBack} onNext={onNext} showBack={true} />
    </form>
  );
}

export default ContentStep;