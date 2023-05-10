# DEMO CREDIT TEST APP

* This project is a simple demo credit application for learning NodeJs, Typescript and Knexjs.

# Routes

<u> AUTHENTICATION </u>
<dl>
    <dd>Registration: This is registration route [it takes the name, email and password param]. </dd>
    <dd>Login: This is login route [it takes the email and password param].</dd>
    <dd>Logout: This route removes the stored token and logs out the user.</dd>
</dl>

<u> Profile </u>
<dl>
  <dd>Dashboard: This route displays the user information. </dd>
  <dd>Wallet Balance: this route shows the user's wallet balance.</dd>
  <dd>Transaction History: this route displays all the transactions made by the user.</dd>
</dl>

<u> WALLET </u>
<dl>
  <dd>Create/Activate Wallet: This route activates the wallet system of the user</dd>
  <dd>Fund Wallet: This route funds the user's wallet with the amount. it takes in [amount param].</dd>
  <dd>Transfer Fund: This route transfers the user's fund into the recipient account with the amount. it takes in [id of the recipient and amount param].</dd>
  <dd>Withdraw Fund: This route withdraws specified amount from the user's wallet. it takes the [amount param].</dd>
</dl>
