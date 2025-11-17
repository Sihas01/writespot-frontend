import FileUpload from "./FileUpload";
import NavigationButtons from "./NavigationButtons";
import SelectField from "./SelectField";
import TextareaField from "./TextareaField";

function ContentStep({ formData, onChange, onBack, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'epub', label: 'EPUB' },
    { value: 'mobi', label: 'MOBI' },
    { value: 'docx', label: 'DOCX' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-medium text-gray-800 mb-8">eBook Content</h2>

       <FileUpload
          label="Cover Image"
          name="coverImage"
          onChange={onChange}
          accept="image/*"
          required
          file={formData.coverImage}
        />

      <div className="space-y-6">
        <FileUpload
          label="Manuscript File"
          name="manuscript"
          onChange={onChange}
          accept=".pdf,.epub,.mobi,.docx"
          required
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

        <TextareaField
          label="Table of Contents"
          name="tableOfContents"
          value={formData.tableOfContents}
          onChange={onChange}
          placeholder="Enter table of contents"
          rows={6}
        />

        <FileUpload
          label="Sample Chapter"
          name="sampleChapter"
          onChange={onChange}
          accept=".pdf,.epub,.docx"
          file={formData.sampleChapter}
        />
      </div>

      <NavigationButtons onBack={onBack} onNext={onNext} showBack={true} />
    </form>
  );
}

export default ContentStep;