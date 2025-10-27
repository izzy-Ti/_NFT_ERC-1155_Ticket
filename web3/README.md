1. Minting & Supply

mint(address to, uint256 id, uint256 amount, bytes data) – create tickets.

mintBatch(address to, uint256[] ids, uint256[] amounts, bytes data) – multiple ticket types at once.

setMaxSupply(uint256 id, uint256 max) – limit number of tickets per type.

2. Sales & Payments

buyTicket(uint256 id, uint256 amount) – buy tickets for ETH or token.

setPrice(uint256 id, uint256 price) – set ticket price.

3. Metadata & Info

uri(uint256 id) – return metadata for ticket type (event, seat, date).

ticketsSold(uint256 id) – track sales.

4. Ownership & Transfer

Standard ERC-1155 transfers (safeTransferFrom, safeBatchTransferFrom).

Optional: resellTicket(uint256 id, uint256 amount, address to) for secondary sales.

5. Access Control

Only admin can mint (onlyOwner or onlyAdmin).

Optional whitelist for presales.

6. Utility / Optional

pause() / unpause() – stop sales in emergencies.

withdraw() – admin withdraws funds.

checkAvailability(uint256 id) – returns how many tickets are left.