/**
 * v0 by Vercel.
 * @see https://v0.dev/t/wD7kZZa9JE6
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Access your account with your username and password.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="Password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <Button>Login with Steam</Button>
        <Button className="w-full bg-green-600">Sign in</Button>
      </CardFooter>
    </Card>
  )
}

