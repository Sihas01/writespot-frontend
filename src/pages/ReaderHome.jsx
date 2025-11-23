const ReaderHome = () => {
     const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name;
    return (
        <div className="pt-6">
            <h2 className="text-2xl md:text-3xl font-nunito font-semibold text-[#5A7C65] mb-6">Welcome, {userName.split(" ")[0]}</h2>
            </div>
    );
}           
export default ReaderHome;