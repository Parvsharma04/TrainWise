import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function DevTeamPage() {
  // Avatar components
  const Avatar = ({ children, className }) => (
    <div
      className={`rounded-full border-4 border-white shadow-2xl overflow-hidden ${className}`}
    >
      {children}
    </div>
  );

  const AvatarImage = ({ src, alt }) => (
    <img className="w-full h-full object-cover" src={src} alt={alt} />
  );

  const AvatarFallback = ({ children }) => (
    <div className="bg-gradient-to-r text-white font-bold flex items-center justify-center rounded-full w-full h-full">
      {children}
    </div>
  );

  // Card components
  const Card = ({ children, className }) => (
    <div
      className={`bg-white shadow-2xl rounded-2xl overflow-hidden transition-transform transform hover:scale-105 duration-300 ${className}`}
    >
      {children}
    </div>
  );

  const CardHeader = ({ children, className }) => (
    <div
      className={`bg-gradient-to-r from-slate-100 via-slate-400 to-slate-100 text-white pt-12 px-8 rounded-t-xl h-96 ${className}`}
    >
      {children}
    </div>
  );

  const CardTitle = ({ children }) => (
    <h3 className="text-2xl font-semibold tracking-wide">{children}</h3>
  );

  const CardContent = ({ children }) => (
    <div className="p-8 bg-gray-50">{children}</div>
  );

  const developers = [
    {
      name: "ARSHDEEP ROOPRAI",
      role: "Full Stack Developer",
      image: "https://avatars.githubusercontent.com/u/108752646?v=4",
      github: "https://github.com/Arshdeep-13",
      linkedin: "https://www.linkedin.com/in/arshdeeprooprai",
      mail: "arshdeeprooprai@gmail.com",
    },
    {
      name: "PARV SHARMA",
      role: "Full Stack Developer",
      image: "https://avatars.githubusercontent.com/u/115033639?v=4",
      github: "https://github.com/Parvsharma04",
      linkedin: "https://www.linkedin.com/in/parv-sharma-470498259",
      mail: "sharmaparv.2004@gmail.com",
    },
    {
      name: "AVI RANA",
      role: "Full Stack Developer",
      image: "https://avatars.githubusercontent.com/u/68737072?v=4",
      github: "https://github.com/Avi-Rana-1718",
      linkedin: "https://www.linkedin.com/in/avi-rana",
      mail: "hello@avirana.com",
    },
    {
      name: "PRIYANSHU GUPTA",
      role: "Full Stack Developer",
      image: "img.jpg",
      github: "https://github.com/PriyanshuGupta19",
      linkedin: "https://www.linkedin.com/in/priyanshu-gupta-671309252/",
      mail: "priyanshugupta2028@gmail.com",
    },
  ];

  return (
    <>
      <div className="container mx-auto py-12 px-4 sm:px-6 md:px-8 lg:px-12 lg:mt-16 md:mt-12 sm:mt-15 mt-12">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-slate-200 via-blue-400 to-black bg-clip-text text-transparent relative">
          Meet The Developer Team
          <span className="block h-1 mx-auto mt-2 bg-gradient-to-r from-white via-blue-500 to-black animate-pulse transition-all duration-500 ease-in-out"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {developers.map((developer, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="text-center">
                <Avatar className="w-72 h-72 mx-auto">
                  <AvatarImage src={developer.image} alt={developer.name} />
                  <AvatarFallback>
                    {developer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{developer.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="flex flex-col justify-center items-center text-center text-xl text-muted-foreground mb-4">
                  <span className="mb-2">{developer.role}</span>
                  <span className="text-sm">{developer.mail}</span>
                </p>
                <div className="flex justify-end space-x-4">
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <FaGithub className="w-6 h-6" />
                  </a>
                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
