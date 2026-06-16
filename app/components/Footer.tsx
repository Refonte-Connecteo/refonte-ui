export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <p className="text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} Connecteo. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
