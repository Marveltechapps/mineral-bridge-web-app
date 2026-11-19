export * as authService from './auth.service';
export * as meService from './me.service';
export * as kycService from './kyc.service';
export * as filesService from './files.service';
export * as catalogueService from './catalogue.service';
export * as cartService from './cart.service';
export * as ordersService from './orders.service';
export * as refundsService from './refunds.service';
export * as auctionsService from './auctions.service';
export * as notificationsService from './notifications.service';
export * as supportService from './support.service';
export * as documentsService from './documents.service';
export * as referenceService from './reference.service';
export * as sampleService from './sampleService';
export * as realtime from './realtime';

// Flat re-exports for the most common names. Name clashes (e.g. `register`, `getFaqs`) stay namespaced above.
export { requestOtp, resendOtp, verifyOtp, register, refresh, logout, listSessions, revokeSession } from './auth.service';
export { getMe, patchMe, contactChange, verifyContactChange, putBusinessType, getSummary, getPrefs, patchPrefs } from './me.service';
export { getKyc, patchKyc, putDocument, deleteDocument, submitKyc } from './kyc.service';
export { uploadFile, getFileUrl } from './files.service';
export { getCategories, listProducts, getProduct, getProductDocument } from './catalogue.service';
export { getCart, putItem, removeItem } from './cart.service';
export {
  createBuyOrder, createSellOrder, listOrders, getOrder, acceptQuote, declineQuote, getContract, signContract,
  submitBuyerForm, btcQuote, submitPayment, submitSellerForm, acceptInspection, queryInspection, confirmReceipt,
  disputeReceipt, getCancellation, cancelOrder, getShipment, listDocuments, listMessages, sendMessage,
  submitChanges, decideVariation,
} from './orders.service';
export { createRefund, listRefunds, getRefund } from './refunds.service';
export {
  listAuctions, listMyBids, getAuction, listBids, placeBid, setAutoBid, clearAutoBid, setReminder, clearReminder,
  createWinnerOrder,
} from './auctions.service';
export { listNotifications, markRead, markAllRead, registerDevice, unregisterDevice } from './notifications.service';
export { getFaqs, listThreads, createThread, getThread, postMessage } from './support.service';
export { getDocument, downloadDocumentPdf } from './documents.service';
export { getReference } from './reference.service';
export { connectNotificationStream, connectAuctionWs } from './realtime';
