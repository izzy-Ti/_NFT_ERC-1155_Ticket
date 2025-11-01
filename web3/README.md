NFT Concert Ticket System

ERC-1155 based NFT ticket platform for concerts and events. Features:

1. Minting & Supply

mint(address to, uint256 id, uint256 amount, bytes data) – create tickets.

mintBatch(address to, uint256[] ids, uint256[] amounts, bytes data) – create multiple ticket types at once.

setMaxSupply(uint256 id, uint256 max) – limit the number of tickets per type.

2. Sales & Payments

buyTicket(uint256 id, uint256 amount) – buy tickets with ETH.

setPrice(uint256 id, uint256 price) – set ticket price for each type.

3. Metadata & Info

uri(uint256 id) – returns metadata for the ticket type (event, seat, date, image).

ticketsSold(uint256 id) – track sales per ticket type.

4. Ownership & Transfer

Standard ERC-1155 transfers (safeTransferFrom, safeBatchTransferFrom).

Optional secondary sales with resellTicket(uint256 id, uint256 amount, address to).

5. Access Control

Only admin can mint and set prices.

Optional whitelist for presales.

6. Utility / Optional

pause() / unpause() – stop or resume ticket sales.

withdraw() – admin withdraws funds from sales.

checkAvailability(uint256 id) – returns remaining tickets per type.