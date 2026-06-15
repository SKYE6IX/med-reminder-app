import ExpoModulesCore
import YooKassaPayments

struct TokenizeOptions : Record {
    @Field var amount: Double = 0.0
    
    @Field var currency: String = "RUB"

    @Field var title: String = ""

    @Field var subtitle: String = ""

    @Field var clientApplicationKey: String = ""
    
    @Field var shopId: String = ""
}

public class YomoneySdkModule: Module, TokenizationModuleOutput {
    
    private var pendingPromise: Promise?
    private var tokenizationVC: UIViewController?
    
    
    public func didFinish(on module: TokenizationModuleInput, with error: YooKassaPaymentsError?) {
        let promise = pendingPromise
        pendingPromise = nil
        
        DispatchQueue.main.async {
          self.tokenizationVC?.dismiss(animated: true)
          self.tokenizationVC = nil
        }
        
        if let error{
            promise?.reject("TOKENIZATION_ERROR", error.localizedDescription)
        } else{
            promise?.resolve(nil)
        }
    }
    
    public func didFinishConfirmation(paymentMethodType: PaymentMethodType) {
        
    }
    
    public func didFailConfirmation(error: YooKassaPaymentsError?) {
        
    }
    
    public func tokenizationModule(_ module:TokenizationModuleInput,
                                   didTokenize token: Tokens,
                                   paymentMethodType: PaymentMethodType) {
        let promise = pendingPromise
        pendingPromise = nil
        
        DispatchQueue.main.async {
            self.tokenizationVC?.dismiss(animated: true){
                self.tokenizationVC = nil
                let response: [String: Any] = [
                    "paymentToken": token.paymentToken,
                    "paymentMethod": paymentMethodType.rawValue
                ]
                promise?.resolve(response)
            }
        }
    }
    
    
//    MARK: - Module defination
    public func definition() -> ModuleDefinition {
        
        Name("YomoneySdk")
        
        AsyncFunction("startTokenize"){ (options: TokenizeOptions, promise: Promise) in
            
            DispatchQueue.main.async {
                guard let currentVC = self.appContext?.utilities?.currentViewController() else {
                    return promise.reject("ERR_MISSING_VC", "No Available ViewController")
                }
                
                guard self.pendingPromise == nil else {
                    return promise.reject("PENDING_PAYMENT",
                      "Another payment process is active")
                }
                
                self.pendingPromise = promise
                
                let amount = Amount(
                    value: Decimal(options.amount), currency: .rub
                )
                
                let tokenizationSettings = TokenizationSettings(paymentMethodTypes: .bankCard)
                
                let paymentParameters = TokenizationModuleInputData(
                    clientApplicationKey: options.clientApplicationKey,
                    shopName: "MedremindR",
                    shopId: options.shopId,
                    purchaseDescription: "Премиальный план",
                    amount: amount,
                    tokenizationSettings: tokenizationSettings,
                    savePaymentMethod: .on
                )
                
                let viewController = TokenizationAssembly.makeModule(
                    inputData: .tokenization(paymentParameters), moduleOutput: self)
                
                self.tokenizationVC = viewController
                currentVC.present(viewController, animated: true)
            }
        
        }
        
    }
    
}
