import ExpoModulesCore
//import YooKassaPayments

struct TokenizeOptions : Record {
    @Field
    var amount: Double = 0.0

    @Field
    var currency: String = "RUB"

    @Field
    var title: String = ""

    @Field
    var subtitle: String = ""

    @Field
    var clientApplicationKey: String = ""

    @Field
    var shopId: String = ""
}

public class YomoneySdkModule: Module {
    
    private var pendingPromise: Promise?
    private var tokenizationVC: UIViewController?
    
  public func definition() -> ModuleDefinition {
    Name("YomoneySdk")
    
    AsyncFunction("startTokenize") { (options: TokenizeOptions, promise: Promise) in
        
//        guard let currentVC = appContext?.utilities?.currentViewController() else {
//              return promise.reject(Exceptions.MissingCurrentViewController())
//            }
        
//        guard self.pendingPromise == nil else {
//            return promise.reject("PENDING_PAYMENT",
//              "Another payment process is active")
//          }
        
//        self.pendingPromise = promise
        
//        let amount = Amount(
//               value: Decimal(options.amount),
//               currency: Currency(rawValue: options.currency) ?? .rub
//             )
        
//        let paymentParameters = TokenizationModuleInputData(
//             clientApplicationKey: options.clientApplicationKey,
//             title: options.title,
//             subtitle: options.subtitle,
//             amount: amount,
//             shopId: options.shopId,
//             savePaymentMethod: .userSelects,
//             paymentMethodTypes: [.bankCard, .sbp]
//           )
        
//        DispatchQueue.main.async {
//            let vc = TokenizationAssembly.makeModule(inputData: paymentParameters,
//                                                     moduleOutput: self)
//            self.tokenizationVC = vc
//            currentVC.present(vc, animated: true)
//        }
    }
  }
    
    
//    public func tokenizationModule(
//      _ module: TokenizationModuleInput,
//      didTokenize token: Tokens,
//      paymentMethodType: PaymentMethodType
//    ) {
//      dismissAndResolve(token: token, paymentMethodType: paymentMethodType)
//    }
    
//    public func didFinish(
//      on module: TokenizationModuleInput,
//      with error: YooKassaPaymentsError?
//    ) {
//      let promise = pendingPromise
//      pendingPromise = nil
//
//      DispatchQueue.main.async {
//        self.tokenizationVC?.dismiss(animated: true)
//        self.tokenizationVC = nil
//      }
//
//      if let error {
//        promise?.reject("TOKENIZATION_ERROR", error.localizedDescription)
//      } else {
//        // User cancelled
//        promise?.resolve(nil)
//      }
//    }
    
//    private func dismissAndResolve(token: Tokens, paymentMethodType: PaymentMethodType) {
//        let promise = pendingPromise
//        pendingPromise = nil
//
//        DispatchQueue.main.async {
//            self.tokenizationVC?.dismiss(animated: true){
//                self.tokenizationVC = nil
//                let response: [String: Any] = [
//                        "paymentToken": token.paymentToken,
//                        "paymentMethod": paymentMethodType.rawValue
//                      ]
//                promise?.resolve(response)
//            }
//        }
//    }
}
