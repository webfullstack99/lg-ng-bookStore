import { Component, OnInit, Input } from '@angular/core';
import { AdminModelService } from 'src/app/admin/shared/services/admin-model.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-test-db',
    templateUrl: './test-db.component.html',
    styleUrls: ['./test-db.component.css']
})
export class TestDbComponent implements OnInit {

    public _retrievingSubscription: Subscription;
    public _collection: string = 'tests';
    public _createdQty: number = 0;
    public _progress: number = 0;

    @Input('testFor') _testFor: string;
    @Input('itemQty') _itemQty: number = 100;

    constructor(
        public _model: AdminModelService
    ) { }

    ngOnInit() {
    }

    public runTest(): void {
        switch (this._testFor) {
            case 'creating':
                this.runTestForCreating();
                break;

            case 'retrieving':
                this.runTestForRetrieving();
                break;
        }
    }

    private runTestForCreating(): void {
        let startingTime: number = Date.now();
        let promises: Promise<any>[] = [];
        for (let i = 1; i <= this._itemQty; i++) {
            promises.push(new Promise((resolve) => {
                this._model.db.list(this._collection).push({
                    title: 'Điều Kỳ Diệu Của Tiệm Tạp Hóa',
                    category: 'Tieu thuyet',
                    price: 100000,
                    description: `Điều Kỳ Diệu Của Tiệm Tạp Hóa Một đêm vội vã lẩn trốn sau phi vụ khoắng đồ nhà người, Atsuya, Shota và Kouhei đã rẽ vào lánh tạm trong một căn nhà hoang bên con dốc vắng người qua lại. Căn nhà có vẻ khi xưa là một tiệm tạp hóa với biển hiệu cũ kỹ bám đầy bồ hóng, khiến người ta khó lòng đọc được trên đó viết gì. Định bụng nghỉ tạm một đêm rồi sáng hôm sau chuồn sớm, cả ba không ngờ chờ đợi cả bọn sẽ là một đêm không ngủ, với bao điều kỳ bí bắt đầu từ một phong thư bất ngờ gửi đến… Tài kể chuyện hơn người đã giúp Keigo khéo léo thay đổi các mốc dấu thời gian và không gian, chắp nối những câu chuyện tưởng chừng hoàn toàn riêng rẽ thành một kết cấu chặt chẽ, gây bất ngờ từ đầu tới cuối. Giá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Tuy nhiên tuỳ vào từng loại sản phẩm hoặc phương thức, địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, ...`,
                    created: {
                        time: Date.now(),
                        userId: 'dsfasdfj45942342093rfjdsfjfsd',
                    },
                    modified: {
                        time: Date.now(),
                        userId: 'dsfasdfj45942342093rfjdsfjfsd',
                    },
                }).then(() => {
                    this._createdQty++;
                    this._progress = Math.round((this._createdQty / this._itemQty) * 100);
                    resolve();
                })
            }))
        }
        Promise.all(promises).then(() => {
            let timeConsuming = ((Date.now() - startingTime) / 1000).toFixed(3);
            console.log(`${this._itemQty} items created in ${timeConsuming}s`);
        })
    }

    private runTestForRetrieving(): void {
        let startingTime: number = Date.now();
        this._retrievingSubscription = this._model.db.list(this._collection).valueChanges().subscribe((data) => {
            let timeConsuming = ((Date.now() - startingTime) / 1000).toFixed(3);
            console.log(`${data.length} items retrieved in ${timeConsuming}s`);
            this._progress = 100;
            this._retrievingSubscription.unsubscribe();
        })
    }

    public clearTest(): void {
        this._model.db.list(this._collection).remove().then(() => {
            console.log('Cleared');
        });
    }

    public reset(): void {
        this._progress = 0;
        this._createdQty = 0;
    }
}
