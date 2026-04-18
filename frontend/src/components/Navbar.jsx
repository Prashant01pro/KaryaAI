function Navbar() {
  return (
    <div className="bg-amber-400 w-screen flex justify-between items-center h-15 ">
      <div className="flex gap-2 pl-20">
        <img className="h-12 w-12 rounded-full" src="https://static.vecteezy.com/system/resources/thumbnails/041/270/385/small_2x/kai-letter-logo-design-inspiration-for-a-unique-identity-modern-elegance-and-creative-design-watermark-your-success-with-the-striking-this-logo-vector.jpg" alt="Logo" />
        <h1 className="text-4xl font-bold">KaryaAI</h1>
      </div>

      <div className="flex gap-8 pr-20 text-[20px] font-medium hover:border-b-black">
        {/* <link>Login</link>
        <link>Create Account</link>
        <link>Logout</link> */}
         <button className="hover:">Login</button>
         <button className="hover:border-b-black">Create Account</button>
         <button className="hover:border-b-black">Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
